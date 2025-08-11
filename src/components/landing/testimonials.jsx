import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-12  bg-muted animate-fade-in">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {/* <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Testimonials
            </div> */}
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear directly from product managers and teams who have transformed their workflow with ProductFlow.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">
                &quot;ProductFlow has revolutionized how our team manages features. The dashboards are incredibly
                insightful!&quot;
              </p>
            </CardContent>
            <CardHeader className="flex flex-row items-center gap-4 pt-0">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">Jane Doe</CardTitle>
                <p className="text-sm text-muted-foreground">Lead Product Manager, Acme Corp</p>
              </div>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">
                &quot;The collaboration features are a game-changer. Our cross-functional teams are more aligned than
                ever.&quot;
              </p>
            </CardContent>
            <CardHeader className="flex flex-row items-center gap-4 pt-0">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">Alex Smith</CardTitle>
                <p className="text-sm text-muted-foreground">Head of Product, Global Innovations</p>
              </div>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">
                &quot;We've cut down our release cycles by 30% thanks to ProductFlow's intuitive release
                management.&quot;
              </p>
            </CardContent>
            <CardHeader className="flex flex-row items-center gap-4 pt-0">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>MB</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">Maria Brown</CardTitle>
                <p className="text-sm text-muted-foreground">Product Lead, Tech Solutions Inc.</p>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
