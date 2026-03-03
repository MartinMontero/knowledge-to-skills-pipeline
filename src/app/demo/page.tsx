"use client";

import { useState, useEffect } from "react";
import { Sparkles, Send, Loader2, Zap, BookOpen, DollarSign } from "lucide-react";

interface Skill {
  id: number;
  slug: string;
  name: string;
  description: string;
  pricePerUse: number | null;
  subscriptionPrice: number | null;
  suite: { name: string; slug: string } | null;
}

export default function DemoPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [invoking, setInvoking] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data.skills || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const invokeSkill = async () => {
    if (!selectedSkill || !input.trim()) return;

    setInvoking(true);
    setOutput("");

    try {
      const res = await fetch("/api/skills/invoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: selectedSkill.id,
          input: input,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOutput(data.output);
      } else {
        setOutput(`Error: ${data.error}`);
      }
    } catch (error) {
      setOutput(`Error: Failed to invoke skill`);
    } finally {
      setInvoking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Skill Execution Demo
          </h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Try invoking AI skills powered by the Knowledge-to-Skills Pipeline.
            Select a skill and enter your prompt to see how it works.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Available Skills
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                </div>
              ) : skills.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">No skills available yet.</p>
                  <p className="text-slate-500 text-sm">
                    Skills will be loaded from the database.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => {
                        setSelectedSkill(skill);
                        setOutput("");
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedSkill?.id === skill.id
                          ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/50"
                          : "bg-slate-700/30 border-2 border-transparent hover:border-slate-600"
                      }`}
                    >
                      <div className="font-medium text-white">{skill.name}</div>
                      <div className="text-sm text-slate-400 mt-1">
                        {skill.description}
                      </div>
                      {skill.suite && (
                        <div className="text-xs text-purple-300 mt-2">
                          From: {skill.suite.name}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {skill.pricePerUse && (
                          <div className="flex items-center gap-1 text-xs text-amber-400">
                            <Zap className="w-3 h-3" />
                            {skill.pricePerUse} sats/use
                          </div>
                        )}
                        {skill.subscriptionPrice && (
                          <div className="flex items-center gap-1 text-xs text-green-400">
                            <DollarSign className="w-3 h-3" />
                            {skill.subscriptionPrice} sats/mo
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Invocation Interface */}
          <div className="lg:col-span-2">
            {selectedSkill ? (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Invoke: {selectedSkill.name}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {selectedSkill.description}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-amber-500/20 rounded-full text-amber-400 text-sm">
                    Demo Mode
                  </div>
                </div>

                {/* Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Prompt
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask something like: "How can I apply ${selectedSkill.name} to protest corporate greed?"`}
                    className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                  />
                </div>

                {/* Invoke Button */}
                <button
                  onClick={invokeSkill}
                  disabled={invoking || !input.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-600 disabled:to-slate-600 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed"
                >
                  {invoking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Invoking Skill...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Invoke Skill
                    </>
                  )}
                </button>

                {/* Output */}
                {output && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Response
                    </label>
                    <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-purple-100 whitespace-pre-wrap">
                      {output}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-12 text-center">
                <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Select a Skill
                </h3>
                <p className="text-slate-400">
                  Choose a skill from the list to try invoking it.
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="mt-6 bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
              <h4 className="text-blue-300 font-medium mb-2">ℹ️ About this Demo</h4>
              <p className="text-blue-200/70 text-sm">
                This demo showcases the skill execution flow. In production:
              </p>
              <ul className="text-blue-200/70 text-sm mt-2 space-y-1">
                <li>• Skills are stored in Onyx (encrypted knowledge vault)</li>
                <li>• Execution uses Maple AI with skill context</li>
                <li>• Payments flow via NIP-57 Lightning Zaps</li>
                <li>• Revenue splits: 70% IP owner, 20% author, 10% platform</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
