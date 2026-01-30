import React from "react";
import Advokasi from "../../../Assets/Photo-Home/Advokasi.svg";
import Inisiatif from "../../../Assets/Photo-Home/Inisiatif.svg";
import Kolaborasi from "../../../Assets/Photo-Home/Kolaborasi.svg";

const hero = () => {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-8 lg:px-16 animate-scale"
    >
      {/* ===== TEKS UTAMA ===== */}
      <h2 className="text-base md:text-3xl font-gotham-bold text-black mb-2">
        Tumbuh <span className="text-[#4a0000]">Bersama</span> Wujudkan{" "}
        <span className="text-[#FD8F17] font-semibold">Asa</span>
      </h2>

      <h1
        className="text-2xl md:text-6xl font-cinzel font-bold mb-4 
        bg-[linear-gradient(to_bottom,#BB0001_40%,#810001_80%)] 
        bg-clip-text text-transparent"
      >
        BEM KM FASILKOM UNSRI
      </h1>

      <p className="max-w-3xl font-gotham-book text-sm md:text-lg text-[#3E3E3E] leading-relaxed mb-8">
        Sebagai wadah aspirasi mahasiswa, BEM KM Fasilkom UNSRI hadir untuk
        menjembatani suara mahasiswa dengan civitas akademika, serta menciptakan
        ruang pengembangan diri di bidang akademik, kepemimpinan, dan sosial.
      </p>

      {/* ===== TOMBOL ===== */}
      <div className="flex gap-4 text-sm md:text-lg">
        <a href="https://ilkomnews.bemilkomunsri.org/">
          <button className="bg-[#4A0000] text-white px-6 py-2 rounded-md font-medium hover:bg-transparent hover:border-[#4A0000] hover:border hover:text-[#4A0000] transition">
            More Info
          </button>
        </a>
        <a href="https://gaspol.bemilkomunsri.org/">
          <button className="border border-[#4A0000] text-[#4A0000] px-6 py-2 rounded-md font-medium hover:bg-[#4A0000] hover:text-white transition">
            Send a Report
          </button>
        </a>
      </div>

      {/* ===== GAMBAR TAG MENGAMBANG ===== */}
      {/* Inisiatif */}
      <img
        src={Inisiatif}
        alt="Inisiatif"
        className="absolute left-10 top-1/4 w-28 md:w-36 animate-float-slow"
      />

      {/* Kolaborasi */}
      <img
        src={Kolaborasi}
        alt="Kolaborasi"
        className="absolute right-10 top-7 sm:top-20 md:top-24 w-28 md:w-36 animate-float-slow"
      />

      {/* Advokasi */}
      <img
        src={Advokasi}
        alt="Advokasi"
        className="absolute right-16 md:right-80 bottom-24 w-28 md:w-36 animate-float-slow"
      />

      <div className="circlePosition w-[260px] h-[200px] bg-[#4A0000] rounded-full absolute z-1 top-[80%] left-[8%] -translate-x-1/2 -translate-y-1/2 blur-[180px]"></div>
      <div className="circlePosition w-[260px] h-[200px] bg-[#FBBF6A] rounded-full absolute z-1 top-[80%] left-[34%] -translate-x-1/2 -translate-y-1/2 blur-[180px]"></div>
      <div className="circlePosition w-[260px] h-[200px] bg-[#4A0000] rounded-full absolute z-1 top-[80%] left-[64%] -translate-x-1/2 -translate-y-1/2 blur-[180px]"></div>
      <div className="circlePosition w-[260px] h-[200px] bg-[#FBBF6A] rounded-full absolute z-1 top-[80%] left-[90%] -translate-x-1/2 -translate-y-1/2 blur-[180px]"></div>
    </section>
  );
};

export default hero;
