import Link from "next/link";
import { Notice } from "@/components/common/notice";
import { Button, buttonVariants } from "@/components/ui/button";

/**
 * In place of the panes when there's no Resume to edit: none with this id in
 * this browser ("not-found"), or the browser won't let the app read its
 * storage ("failed"). Both offer a way back to the Library; a storage error
 * can also be retried, by reloading the page.
 */
export function MissingResume({ reason }: { reason: "not-found" | "failed" }) {
  const back = (
    <Link href="/resume-builder" className={buttonVariants({ variant: "outline", size: "lg" })}>
      Back to resumes
    </Link>
  );

  return (
    <div className="flex grow items-center justify-center bg-app px-4 pb-14">
      {reason === "not-found" ? (
        <Notice title="This resume isn't here" actions={back}>
          It may have been deleted, or made in another browser. Resumes are saved only in the browser they were made
          in.
        </Notice>
      ) : (
        <Notice
          role="alert"
          title="This resume couldn't be opened"
          actions={
            <>
              <Button size="lg" onClick={() => window.location.reload()}>
                Try again
              </Button>
              {back}
            </>
          }
        >
          This browser may be blocking site storage. Allow cookies and site data for this site, then try again.
        </Notice>
      )}
    </div>
  );
}
