import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { Hero } from "@/components/Hero";
import { Anniversary } from "@/components/Anniversary";
import { Vision } from "@/components/Vision";
import { ServiceTimes } from "@/components/ServiceTimes";
import { CTA } from "@/components/CTA";

export default function HomePage({ params }: { params: { lang: Lang } }) {
  const dict = getDictionary(params.lang);
  return (
    <>
      <Hero lang={params.lang} dict={dict} />
      <Anniversary dict={dict} />
      <Vision dict={dict} />
      <ServiceTimes dict={dict} />
      <CTA lang={params.lang} dict={dict} />
    </>
  );
}
