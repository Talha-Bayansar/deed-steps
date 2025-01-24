import { APP_NAME } from "@/lib/constants";

const testimonials = [
  {
    name: "John Doe",
    role: "CEO, TechCorp",
    image: "/placeholder.svg?height=400&width=400",
    quote: `${APP_NAME} has revolutionized the way we work. Our team productivity has increased by 40% since we started using it.`,
  },
  {
    name: "Hassan Davis",
    role: "Project Manager, InnovateCo",
    image: "/placeholder.svg?height=400&width=400",
    quote: `I can't imagine managing our projects without ${APP_NAME}. It's intuitive, powerful, and has all the features we need.`,
  },
  {
    name: "Abdulkadir Chen",
    role: "Freelance Designer",
    image: "/placeholder.svg?height=400&width=400",
    quote: `As a freelancer, staying organized is crucial. ${APP_NAME} helps me manage multiple clients and projects effortlessly.`,
  },
];

const Testimonials = () => {
  return (
    <div id="testimonials" className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by professionals worldwide
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <blockquote className="mt-2 text-xl font-semibold text-gray-900">
                    {`"${testimonial.quote}"`}
                  </blockquote>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={testimonial.image || "/placeholder.svg"}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
