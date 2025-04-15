import React, { useState } from 'react';
import OpenAI from 'openai';

interface AIPromptProps {
  apiKey: string;
}

export const AIPrompt: React.FC<AIPromptProps> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('Type your prompt and click Generate Response to start...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: This is for demonstration purposes only
      });

      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });

      setResponse(completion.choices[0]?.message?.content || 'No response');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {/* 입력 폼 영역 */}
      <div className="bg-white rounded-lg shadow p-4 m-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full">
            <div>
                Enter your prompt
            </div>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-100 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              placeholder="Type your prompt here..."
              style={{ height: '340px' }}
              rows={10}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !prompt}
            className={`w-100 p-3 my-2 border border-transparent
              ${loading || !prompt 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-700 hover:bg-indigo-800'
              }`}
          >
            {loading ? 'Generating...' : 'Generate Response'}
          </button>
        </form>
      </div>
      {/* 응답 영역 */}
      <div className="bg-white rounded-lg shadow p-4 m-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Response:</h3>
        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-md p-4">
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};
