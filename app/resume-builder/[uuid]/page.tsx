"use client";

import { use } from "react";

export default function ResumeEditorPage({
  params,
}: PageProps<"/resume-builder/[uuid]">) {
  const { uuid } = use(params);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Resume editor</h1>
      <p className="text-zinc-600">
        Editing Resume <code className="font-mono">{uuid}</code>
      </p>
    </main>
  );
}
