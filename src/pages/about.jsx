import React, { useEffect, useState } from "react";
import MemberCard from "./dinas/MemberCard";
import DinasLogo from "./DinasLogo";
import StaffCarousel from "./StaffCarousel";
import dinasService from "../../services/dinasService";
import { orderMembers } from "../../utils/memberOrdering";
import { getDinasDescription } from "../../utils/dinasDescriptions";

const BidangContent = ({ bidangSlug }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidangData, setBidangData] = useState(null);
  const [koorbidMembers, setKoorbidMembers] = useState([]);
  const [dinasList, setDinasList] = useState([]);

  // Bidang configurations
  const bidangConfigs = {
    inti: {
      title: "Bidang Inti",
      description:
        "Inti bertanggung jawab atas kebijakan, koordinasi antarbidang, serta memastikan program kerja berjalan sesuai visi dan misi BEM KM Fasilkom UNSRI.",
      keywords: ["inti"],
      priorityOrder: ["ketua", "wakil"],
    },
    kerumahtanggaan: {
      title: "Bidang Kerumahtanggaan",
      description:
        "Bidang yang bertanggung jawab dalam pengelolaan administrasi, keuangan, dan pengembangan SDM di lingkungan BEM.",
      keywords: ["kerumahtanggaan", "kerumah tanggaan", "kerumah-tanggaan"],
    },
    "sosial-politik": {
      title: "Bidang Sosial Politik",
      description:
        "Bidang yang fokus pada isu-isu sosial, politik, dan advokasi mahasiswa serta pengabdian masyarakat.",
      keywords: ["sosial politik", "sosial-politik", "sospol"],
    },
    relasi: {
      title: "Bidang Relasi",
      description:
        "Bidang yang menjalin hubungan eksternal dengan berbagai pihak untuk mendukung program kerja BEM.",
      keywords: ["relasi"],
    },
    "media-teknologi": {
      title: "Bidang Media & Teknologi",
      description:
        "Bidang yang bertanggung jawab dalam pengelolaan media, informasi, dan pengembangan teknologi di BEM.",
      keywords: ["media teknologi", "media-teknologi", "medtek"],
    },
    minbat: {
      title: "Bidang Minat & Bakat",
      description:
        "Bidang yang bertanggung jawab dalam pengembangan minat dan bakat mahasiswa, serta mengorganisir berbagai kegiatan ekstrakurikuler dan kompetisi.",
      keywords: [
        "minat",
        "bakat",
        "minat & bakat",
        "minat dan bakat",
        "minbat",
      ],
    },
  };

  useEffect(() => {
    const fetchBidangData = async () => {
      setLoading(true);
      setError(null);

      try {
        const config = bidangConfigs[bidangSlug];
        if (!config) {
          throw new Error("Bidang tidak ditemukan");
        }

        // Fetch all bidang to find the current one
        const bidangList = await dinasService.getAllBidang();
        const currentBidang = bidangList.find((bidang) => {
          const slug = (bidang.slug || "").toLowerCase();
          const name = (bidang.nama_bidang || "").toLowerCase();
          return config.keywords.some(
            (k) => slug.includes(k) || name.includes(k)
          );
        });

        if (!currentBidang) {
          throw new Error(
            `Bidang "${config.title}" tidak ditemukan di database`
          );
        }

        setBidangData(currentBidang);

        // Fetch kategori dinas for this bidang
        const kategoriList = await dinasService.getAllKategoriDinas();
        const bidangKategoris = kategoriList.filter(
          (k) => k.bidangId === currentBidang.id
        );

        // For Inti bidang: fetch all members as one list
        if (bidangSlug === "inti") {
          const allMembers = [];
          for (const kategori of bidangKategoris) {
            const members = await dinasService.getDinasMembers(kategori.id);
            allMembers.push(...(members || []));
          }

          // Order with priority for Ketua and Wakil
          const ordered = orderMembers(allMembers, config.priorityOrder);
          setKoorbidMembers(ordered);
          setDinasList([]);
        } else {
          // For other bidang: separate KoorBid and Dinas
          const koorbidKategoris = bidangKategoris.filter((k) =>
            k.nama_dinas.toLowerCase().includes("koorbid")
          );
          const dinasKategoris = bidangKategoris.filter(
            (k) => !k.nama_dinas.toLowerCase().includes("koorbid")
          );

          // Fetch KoorBid members
          const koorbidMembers = [];
          for (const kategori of koorbidKategoris) {
            const members = await dinasService.getDinasMembers(kategori.id);
            koorbidMembers.push(...(members || []));
          }
          setKoorbidMembers(koorbidMembers);

          // Fetch Dinas data with their members
          const dinasData = [];
          for (const kategori of dinasKategoris) {
            const members = await dinasService.getDinasMembers(kategori.id);
            const bphMembers = (members || []).filter(
              (m) => m.jabatan?.toLowerCase() === "bph"
            );
            const staffMembers = (members || []).filter(
              (m) => m.jabatan?.toLowerCase() === "staff"
            );

            dinasData.push({
              ...kategori,
              bph: orderMembers(bphMembers),
              staff: orderMembers(staffMembers),
            });
          }
          setDinasList(dinasData);
        }
      } catch (err) {
        console.error(`Error fetching ${bidangSlug} data:`, err);
        setError(err.message || "Gagal memuat data bidang");
      } finally {
        setLoading(false);
      }
    };

    fetchBidangData();
  }, [bidangSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  const config = bidangConfigs[bidangSlug];

  return (
    <>
      {/* Page-specific header */}
      <div className="py-2 md:py-8 px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-gotham-bold mb-6">
            {config.title}
          </h1>
          <p className="font-gotham-book leading-relaxed text-gray-600 text-sm md:text-lg max-w-3xl mx-auto">
            {config.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-2 md:py-8 text-sm md:text-lg leading-relaxed ">
        {/* Inti Bidang - Single Member List */}
        {bidangSlug === "inti" && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-gotham-bold mb-4">
                Struktur Kepengurusan
              </h2>
              <p className="text-gray-600 font-gotham-book max-w-2xl mx-auto">
                Tim inti yang memimpin dan mengkoordinasikan seluruh kegiatan
                BEM KM Fasilkom UNSRI
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {koorbidMembers.map((member) => (
                <MemberCard
                  key={member.uuid}
                  name={member.nama}
                  position={member.divisi}
                  imageUrl={member.url}
                  label="INTI"
                />
              ))}
            </div>

            {koorbidMembers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 ">
                  Belum ada data anggota untuk bidang Inti
                </p>
              </div>
            )}
          </>
        )}

        {/* Other Bidang - KoorBid + Dinas Structure */}
        {bidangSlug !== "inti" && (
          <>
            {/* Koordinator Bidang Section */}
            {koorbidMembers.length > 0 && (
              <div className="mb-20">
                <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl font-gotham-bold mb-4">
                    Koordinator Bidang
                  </h2>
                  <p className="text-gray-600 font-gotham-book max-w-2xl mx-auto">
                    Pimpinan yang mengkoordinasikan seluruh kegiatan di{" "}
                    {config.title}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                  {koorbidMembers.map((member) => (
                    <MemberCard
                      key={member.uuid}
                      name={member.nama}
                      position={member.divisi}
                      imageUrl={member.url}
                      label="KOORBID"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Dinas Sections */}
            {dinasList.map((dinas) => (
              <div key={dinas.id} className="mb-10 md:mb-20">
                {/* Dinas Header */}
                <div className="text-center mb-12">
                  <DinasLogo dinasName={dinas.nama_dinas} />

                  <h2 className="text-2xl md:text-3xl font-gotham-bold text-gray-900 mb-4">
                    Dinas {dinas.nama_dinas}
                  </h2>
                  <p className="text-gray-600 font-gotham-book max-w-2xl mx-auto">
                    {getDinasDescription(dinas.nama_dinas)}
                  </p>
                </div>

                {/* BPH Section */}
                {dinas.bph.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-gotham-bold text-center mb-8">
                      Badan Pengurus Harian (BPH)
                    </h3>
                    <div className="flex flex-wrap justify-center gap-6">
                      {dinas.bph.map((member) => (
                        <MemberCard
                          key={member.uuid}
                          name={member.nama}
                          position={member.divisi}
                          imageUrl={member.url}
                          label={dinas.nama_dinas.toUpperCase().substring(0, 6)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Staff Section */}
                {dinas.staff.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-gotham-bold text-center mb-8 text-gray-800">
                      Staff
                    </h3>
                    <StaffCarousel
                      staff={dinas.staff}
                      dinasName={dinas.nama_dinas}
                    />
                  </div>
                )}
              </div>
            ))}

            {koorbidMembers.length === 0 && dinasList.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Belum ada data untuk {config.title}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default BidangContent;
