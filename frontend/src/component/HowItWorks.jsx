import step1 from "../assets/img/step1.png";
import step2 from "../assets/img/step2.png";
import step3 from "../assets/img/step3.png";
import step4 from "../assets/img/step4.png";
import step5 from "../assets/img/step5.png";
import step6 from "../assets/img/step6.png";

const steps = [
  { num: 1, title: "Enroll", tag: "START YOUR JOURNEY", image: step1,
    desc: "Create your profile by providing details like name, age, caste, contact number etc. Let us know what you are looking for in a life partner." },
  { num: 2, title: "Find Your Match", tag: "SMART SEARCH FILTERS", image: step2,
    desc: "Explore thousands of verified maratha profiles across maharashtra and abroad. Use powerful filters to narrow down matches based on your preferences." },
  { num: 3, title: "Get Profile Information", tag: "SUBMIT RESPONSE FORM", image: step3,
    desc: "To access full profile details including contact number, fill the response form. You will receive the details shortly after submission." },
  { num: 4, title: "Send Interest", tag: "AUTOMATIC NOTIFICATION", image: step4,
    desc: "After you get the profile details, an automatic interest request is sent to the member. If they are interested, they will respond with Yes or No." },
  { num: 5, title: "Start Meetups", tag: "FAMILY MEETINGS", image: step5,
    desc: "Connect personally or arrange family meetings to understand compatibility, culture, and lifestyle before finalizing your bond." },
  { num: 6, title: "Getting Married", tag: "FINAL STEP", image: step6,
    desc: "Once both families agree, move ahead to a joyful wedding! Share your wedding story with us and inspire other maratha families." },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-[#f0b429] font-semibold text-sm tracking-[0.2em] mb-2">MOMENTS</p>
        <h2 className="text-3xl font-bold text-[#3a0613]">How It Works</h2>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#f0b429]/30 -translate-x-1/2" />

        <div className="flex flex-col gap-16 md:gap-20">
          {steps.map((step, i) => {
            const isEven = i % 2 === 1;

            return (
              <div
                key={step.num}
                className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] items-center gap-6 md:gap-8"
              >
                {/* Left Column */}
                <div className="order-2 md:order-1 flex items-center justify-center md:justify-end">
                  {isEven ? (
                    // Even: Image on left side of line
                    <div className="w-40 h-40 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-36 h-36 object-contain"
                      />
                    </div>
                  ) : (
                    // Odd: Text on left side of line
                    <div className="text-center md:text-right pr-4">
                      <h3 className="font-bold text-[#3a0613] text-xl md:text-2xl">{step.title}</h3>
                      <p className="text-[#f0b429] font-semibold text-xs tracking-[0.15em] mb-2">{step.tag}</p>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-sm ml-auto">{step.desc}</p>
                    </div>
                  )}
                </div>

                {/* Center - Step Number on the Line */}
                <div className="order-1 md:order-2 flex justify-center relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[#fdf6e3] border-2 border-[#f0b429] flex items-center justify-center font-bold text-[#7a1224] text-lg shadow-md">
                    {step.num}
                  </div>
                </div>

                {/* Right Column */}
                <div className="order-3 flex items-center justify-center md:justify-start">
                  {isEven ? (
                    // Even: Text on right side of line
                    <div className="text-center md:text-left pl-4">
                      <h3 className="font-bold text-[#3a0613] text-xl md:text-2xl">{step.title}</h3>
                      <p className="text-[#f0b429] font-semibold text-xs tracking-[0.15em] mb-2">{step.tag}</p>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-sm">{step.desc}</p>
                    </div>
                  ) : (
                    // Odd: Image on right side of line
                    <div className="w-40 h-40 rounded-full flex items-center justify-center overflow-hidden ">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-36 h-36 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}