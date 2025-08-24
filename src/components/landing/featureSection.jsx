"use client"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LayoutDashboard, ListChecks, BarChart, Users, Rocket, Lightbulb } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 bg-gray-200  animate-fade-in">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
         
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From ideation to launch, ProductFlow provides a comprehensive suite of tools to manage your product
              lifecycle.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl items-start gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col items-center p-6 text-center bg-blue-100 hover:shadow-2xl transition-shadow duration-400">
            <LayoutDashboard className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle >Intuitive Dashboards</CardTitle>
            </CardHeader>
            <CardDescription>
              Get a clear overview of your product's progress with customizable dashboards.
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center bg-purple-100 hover:shadow-2xl transition-shadow duration-400">
            <ListChecks className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Robust Task Management</CardTitle>
            </CardHeader>
            <CardDescription>
              Organize, prioritize, and track tasks with ease, ensuring nothing falls through the cracks.
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center bg-green-100 p-6 text-center hover:shadow-2xl transition-shadow duration-400">
            <BarChart className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardDescription>
              Gain insights into product performance and user behavior with detailed reports.
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center bg-orange-100 hover:shadow-2xl transition-shadow duration-400">
            <Users className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Seamless Collaboration</CardTitle>
            </CardHeader>
            <CardDescription>
              Work together effortlessly with built-in communication and sharing features.
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center bg-cyan-100 hover:shadow-2xl transition-shadow duration-400">
            <Rocket className="h-10 w-10 text-primary mb-4" />
            <CardHeader>
              <CardTitle>Release Management</CardTitle>
            </CardHeader>
            <CardDescription>Plan and execute product launches with confidence and precision.</CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center bg-yellow-100 hover:shadow-2xl transition-shadow duration-400">
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
