import { EditorLoader } from "@/components/editor/editor-loader";

/** The editor for the Resume with this id. Keyed by it, so opening another Resume starts afresh. */
export default async function ResumeEditorPage({ params }: PageProps<"/resume-builder/resumes/[uuid]">) {
  const { uuid } = await params;
  return <EditorLoader key={uuid} id={uuid} />;
}
