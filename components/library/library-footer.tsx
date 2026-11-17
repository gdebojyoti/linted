import { cn } from "@/lib/utils";

/**
 * The note at the very bottom of the Library: a tip link and where Linted is
 * made. `className` sets the padding, which differs between screens.
 */
export function LibraryFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "flex shrink-0 flex-col items-center text-center text-[12.5px] leading-normal text-ink-disabled",
        className,
      )}
    >
      <span>
        Linted is built by one person. If it helped,{" "}
        <a
          href="https://pages.razorpay.com/debojyotighosh"
          target="_blank"
          rel="noopener"
          className="text-accent underline hover:text-accent-strong"
        >
          leave a tip
        </a>
        .
      </span>
      <span>Crafted with 🩷 in Durgapur, India</span>
    </footer>
  );
}
