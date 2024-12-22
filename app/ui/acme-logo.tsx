import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white pl-5`}
    >
      <p className="text-[44px]">Acme</p>
    </div>
  );
}
