import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="w-full py-20 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
    >
      {/* Decorative background shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-300/20 dark:bg-purple-800/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-300/20 dark:bg-indigo-800/30 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Testimonials
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl">
            Hear from buyers and sellers who use{" "}
            <span className="font-semibold text-foreground">Manage Mart</span> every day.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-6xl gap-8 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Sarah Chen",
              role: "Verified Buyer",
              img: "/placeholder.svg?height=40&width=40",
              fallback: "SC",
              quote:
                "Found exactly what I needed in minutes. The reviews are genuinely helpful since I know they're from real buyers.",
            },
            {
              name: "Marcus Reed",
              role: "Seller, Reed's Outdoor Gear",
              img: "/placeholder.svg?height=40&width=40",
              fallback: "MR",
              quote:
                "The AI description tool saves me so much time — I can list a new product in under two minutes.",
            },
            {
              name: "Priya Patel",
              role: "Verified Buyer",
              img: "/placeholder.svg?height=40&width=40",
              fallback: "PP",
              quote:
                "Checkout was fast and I got an email the moment my order shipped. Exactly what I want from online shopping.",
            },
          ].map((t, i) => (
            <Card
              key={i}
              className="group relative border border-border bg-card/90 backdrop-blur-md hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl"
            >
              <CardContent className="pt-8">
                <p className="text-lg leading-relaxed text-foreground/90 italic">
                  “{t.quote}”
                </p>
              </CardContent>
              <CardHeader className="flex flex-row items-center gap-4 pt-4">
                <Avatar className="ring-2 ring-primary/30 ring-offset-2">
                  <AvatarImage src={t.img} alt={t.name} />
                  <AvatarFallback>{t.fallback}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-semibold">{t.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </CardHeader>
              {/* Decorative Accent */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
