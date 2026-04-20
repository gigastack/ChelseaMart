import { signOutAction } from "@/app/(storefront)/auth/actions";
import { Button, type ButtonProps } from "@/components/ui/button";

type SignOutFormProps = Omit<ButtonProps, "children" | "type">;

export function SignOutForm({ className, size, variant, ...props }: SignOutFormProps) {
  return (
    <form action={signOutAction}>
      <Button className={className} size={size} type="submit" variant={variant} {...props}>
        Sign out
      </Button>
    </form>
  );
}
