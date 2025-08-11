import Image from "next/image"
import img from "../../../public/images/images (1).jpeg"
export default function AboutSection() {
  return (
    <section id="about" className="w-full py-12 px-10 animate-fade-in">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                About Us
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Empowering Product Teams Worldwide</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                At ProductFlow, we believe that great products are built by empowered teams. Our platform is designed to
                remove the friction from product management, allowing you to focus on innovation and delivering value to
                your users. We're committed to providing intuitive, powerful, and scalable solutions for teams of all
                sizes.
              </p>
            </div>
          </div>
          <Image
            src={img}
            width={550}
            height={310}
            alt="Team Collaboration"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
          />
        </div>
      </div>
    </section>
  )
}
