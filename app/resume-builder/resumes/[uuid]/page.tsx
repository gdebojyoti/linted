import { Editor } from "@/components/editor/editor";
import { sampleResume } from "@/lib/resume/sample-resume";

// Shows the sample Resume for any id until Resumes can be loaded (#8, #10).
export default function ResumeEditorPage() {
  return <Editor resume={sampleResume} />;
}
