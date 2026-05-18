"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseSentencesFromText, tokenizeSentence } from "@/lib/sentence";
import { saveCustomCourse } from "@/lib/storage";
import { Course, Sentence } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<Sentence[]>([]);
  const [error, setError] = useState("");

  const exampleText = `How are you doing? | 你好吗？
What's up? | 怎么了？
Long time no see. | 好久不见。
It's nice to meet you. | 很高兴认识你。
Could you give me a hand? | 你能帮我一下吗？`;

  const handlePreview = () => {
    if (!text.trim()) {
      setError("请输入句子内容");
      return;
    }
    const parsed = parseSentencesFromText(text);
    if (parsed.length === 0) {
      setError("未能解析出有效句子");
      return;
    }
    const sentences: Sentence[] = parsed.map((p, i) => ({
      id: `custom-${Date.now()}-${i}`,
      english: p.english,
      chinese: p.chinese,
      words: tokenizeSentence(p.english),
    }));
    setPreview(sentences);
    setError("");
  };

  const handleSave = () => {
    if (preview.length === 0) return;
    if (!title.trim()) {
      setError("请输入课程名称");
      return;
    }
    const course: Course = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: `自定义课程，${preview.length} 个句子`,
      coverColor: "from-rose-400 to-pink-300",
      tag: "自定义",
      difficulty: "beginner",
      lessons: [
        {
          id: `custom-lesson-${Date.now()}`,
          title: title.trim(),
          description: "自定义句子集",
          sentences: preview,
        },
      ],
      isCustom: true,
    };
    saveCustomCourse(course);
    router.push("/");
  };

  const handleFillExample = () => {
    setTitle("我的自定义句子");
    setText(exampleText);
    setPreview([]);
    setError("");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">
        自定义句子
      </h1>
      <p className="mb-8 text-sm text-gray-400">
        粘贴你想要学习的英文句子，支持批量导入
      </p>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm text-gray-500">课程名称</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：美剧经典台词"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-gray-400"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm text-gray-500">句子内容</label>
            <button
              onClick={handleFillExample}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              填入示例
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setPreview([]);
            }}
            placeholder={`每行一个句子，英文和中文用 | 分隔：\n\nHow are you? | 你好吗？\nNice to meet you. | 很高兴认识你。\n\n也支持纯英文：\nThank you very much.`}
            rows={10}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-gray-400"
          />
          <p className="mt-1 text-[11px] text-gray-300">
            格式：英文 | 中文翻译（每行一句）
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100"
          >
            预览解析
          </button>
          {preview.length > 0 && (
            <button
              onClick={handleSave}
              className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              保存并开始学习
            </button>
          )}
        </div>
      </div>

      {preview.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-medium text-gray-500">
            预览 · {preview.length} 个句子
          </h2>
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
            {preview.map((s, i) => (
              <div key={s.id} className="flex items-start gap-3 p-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-400">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm text-gray-700">{s.english}</p>
                  {s.chinese && (
                    <p className="text-xs text-gray-400">{s.chinese}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
