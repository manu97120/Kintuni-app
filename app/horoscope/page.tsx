import HoroForm from '@/app/ui/horoForm'
export const dynamic = "force-dynamic";

export default function HoroscopePage({
  searchParams,
}: {
  searchParams?: {
    addressQuery?: string;
    longitude?: string;
    lattitude?: string;
  }
}) {
  

  return (
    <>
      <div className="container mx-auto">
        
        <HoroForm searchParams={searchParams} />    
      </div>
    </>
  );
}
