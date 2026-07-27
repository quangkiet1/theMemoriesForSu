import type { FarewellMemory } from "@/types/farewell";

// ============================================================
// FAREWELL MEMORIES DATA
// ============================================================
// Cách thêm ảnh:
//   1. Đặt file ảnh vào: public/images/farewell-memories/
//   2. Thêm một mục vào mảng bên dưới.
//   3. Điền id, src, alt, caption, date tuỳ ý.
//   4. orbitOrder quyết định thứ tự xuất hiện trong vòng xoay.
//
// Tên file mẫu: memory-01.jpg, memory-02.jpg, ...
// Thay bằng ảnh thật của bạn và cập nhật src tương ứng.
// ============================================================

export const farewellMemories: FarewellMemory[] = [
  {
    id: "memory-01",
    src: "/images/farewell-memories/Suzie-1.JPG",
    alt: "",
    caption: "",
    date: "",
    objectPosition: "center",
    featured: true,
    orbitOrder: 1,
  },
  {
    id: "memory-02",
    src: "/images/farewell-memories/Suzie-2.JPG",
    alt: "",
    caption: "",
    date: "",
    objectPosition: "center",
    orbitOrder: 2,
  },
  {
    id: "memory-03",
    src: "/images/farewell-memories/Suzie-3.JPG",
    alt: "",
    caption: "",
    date: "",
    objectPosition: "center top",
    orbitOrder: 3,
  },
  {
    id: "memory-04",
    src: "/images/farewell-memories/Suzie-4.JPG",
    alt: "",
    caption: "",
    date: "",
    objectPosition: "center",
    orbitOrder: 4,
  },
  {
    id: "memory-05",
    src: "/images/farewell-memories/Suzie-5.JPG",
    alt: "",
    caption: "",
    date: "",
    objectPosition: "center",
    orbitOrder: 5,
  },
  {
    id: "memory-06",
    src: "/images/farewell-memories/Suzie-6.JPG",
    alt: "",
    caption: "",
    date: "",
    objectPosition: "center",
    orbitOrder: 6,
  },
  {
    id: "memory-07",
    src: "/images/farewell-memories/Suzie-7.JPG",
    alt: "",
    caption: "",
    date: "",
    objectPosition: "center",
    orbitOrder: 7,
  },
  {
    id: "memory-08",
    src: "/images/farewell-memories/Suzie-8.JPG",
    alt: "",
    caption: "",
    date: "",
    objectPosition: "center",
    orbitOrder: 8,
  },
];

// ============================================================
// Để thêm ảnh, sao chép mẫu sau và dán vào mảng trên:
// ============================================================
//
// {
//   id: "memory-09",
//   src: "/images/farewell-memories/memory-09.jpg",
//   alt: "[Mô tả ngắn gọn về khoảnh khắc này]",
//   caption: "[Caption tuỳ chọn]",
//   date: "[Thời gian]",
//   objectPosition: "center",
//   orbitOrder: 9,
// },
