import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function FAQSection() {
  return (
    <section id="faq" className="w-full py-12  bg-background animate-fade-in">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {/* <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">FAQ</div> */}
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to the most common questions about ProductFlow.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl py-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is ProductFlow?</AccordionTrigger>
              <AccordionContent>
                ProductFlow is a comprehensive product management platform designed to help teams plan, track, and
                launch products more efficiently.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer a 14-day free trial for all new users. No credit card required to get started.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I integrate ProductFlow with other tools?</AccordionTrigger>
              <AccordionContent>
                ProductFlow offers integrations with popular tools like Jira, Slack, and GitHub. More integrations are
                coming soon!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What kind of support do you offer?</AccordionTrigger>
              <AccordionContent>
                We offer email support for all plans, with priority and dedicated support options available for Pro and
                Enterprise plans.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Is my data secure with ProductFlow?</AccordionTrigger>
              <AccordionContent>
                Yes, we take data security very seriously. ProductFlow uses industry-standard encryption and security
                protocols to protect your data.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
