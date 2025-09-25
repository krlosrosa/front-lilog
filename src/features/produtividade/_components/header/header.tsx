import { Avatar, AvatarFallback, AvatarImage } from "@/_shared/components/ui/avatar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-1 py-2 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">LiLo</h1>
        </div>
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}