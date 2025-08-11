"use client"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LayoutDashboard, ListChecks, BarChart, Users, Rocket, Lightbulb } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12  bg-muted animate-fade-in">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {/* <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Key Features
            </div> */}
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From ideation to launch, ProductFlow provides a comprehensive suite of tools to manage your product
              lifecycle.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl items-start gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <LayoutDashboard className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Intuitive Dashboards</CardTitle>
            </CardHeader>
            <CardDescription>
              Get a clear overview of your product's progress with customizable dashboards.
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <ListChecks className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Robust Task Management</CardTitle>
            </CardHeader>
            <CardDescription>
              Organize, prioritize, and track tasks with ease, ensuring nothing falls through the cracks.
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <BarChart className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardDescription>
              Gain insights into product performance and user behavior with detailed reports.
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <Users className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Seamless Collaboration</CardTitle>
            </CardHeader>
            <CardDescription>
              Work together effortlessly with built-in communication and sharing features.
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <Rocket className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Release Management</CardTitle>
            </CardHeader>
            <CardDescription>Plan and execute product launches with confidence and precision.</CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <Lightbulb className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Idea Prioritization</CardTitle>
            </CardHeader>
            <CardDescription>
              Systematically evaluate and prioritize product ideas based on impact and effort.
            </CardDescription>
          </Card>
        </div>
      </div>
    </section>
  )
}
