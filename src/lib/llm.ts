/**
 * Skill execution engine.
 *
 * Turns a loaded skill plus a user prompt into a grounded response. When an
 * Anthropic API key is configured it calls Claude with the skill's markdown as
 * system context; otherwise it returns a deterministic, clearly-labelled demo
 * response so the product is fully explorable with zero configuration.
 *
 * Server-only by nature (imports the Anthropic SDK and reads the API key from
 * the environment) — only import from server code.
 */

import Anthropic from "@anthropic-ai/sdk";
import { env, isLlmConfigured } from "./env";
import type { Skill } from "./skills";
import { buildSystemPrompt, demoResponse } from "./llm-helpers";

export type InvocationMode = "live" | "demo";

export interface InvocationResult {
  output: string;
  mode: InvocationMode;
  model?: string;
  durationMs: number;
  inputTokens?: number;
  outputTokens?: number;
}

/** A safe-to-surface error. `status` maps to an HTTP status; `message` is user-facing. */
export class LlmError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "LlmError";
    this.status = status;
  }
}

/** Extract concatenated text from a Claude message's content blocks. */
function extractText(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
}

export async function runSkill(skill: Skill, input: string): Promise<InvocationResult> {
  const startedAt = Date.now();

  if (!isLlmConfigured || !env.llm.apiKey) {
    return {
      output: demoResponse(skill, input),
      mode: "demo",
      durationMs: Date.now() - startedAt,
    };
  }

  const client = new Anthropic({ apiKey: env.llm.apiKey });

  let message: Anthropic.Message;
  try {
    message = await client.messages.create({
      model: env.llm.model,
      max_tokens: env.llm.maxTokens,
      system: buildSystemPrompt(skill),
      messages: [{ role: "user", content: input }],
    });
  } catch (error) {
    // Map SDK errors to safe, user-facing messages — never leak internals.
    if (error instanceof Anthropic.RateLimitError) {
      throw new LlmError("The model is rate limited right now. Please try again shortly.", 429);
    }
    if (error instanceof Anthropic.AuthenticationError) {
      // Misconfiguration on our side — don't expose details to the client.
      console.error("Anthropic authentication failed — check ANTHROPIC_API_KEY.");
      throw new LlmError("Skill execution is temporarily unavailable.", 503);
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Anthropic API error (${error.status}):`, error.message);
      throw new LlmError("The model could not complete this request. Please try again.", 502);
    }
    console.error("Unexpected error invoking model:", error);
    throw new LlmError("Skill execution failed unexpectedly.", 500);
  }

  if (message.stop_reason === "refusal") {
    throw new LlmError(
      "The model declined to answer this request. Try rephrasing toward a lawful, constructive goal.",
      422,
    );
  }

  const output = extractText(message);
  if (!output) {
    throw new LlmError("The model returned an empty response. Please try again.", 502);
  }

  return {
    output,
    mode: "live",
    model: message.model,
    durationMs: Date.now() - startedAt,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  };
}
