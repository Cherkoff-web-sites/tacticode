import React from "react";

function renderListItem(item, idx) {
  const text = typeof item === "string" ? item : String(item);

  return (
    <li key={idx} className="document-list-item relative pl-[24px] md:pl-[32px]">
      {text}
    </li>
  );
}

function renderBlock(block, idx) {
  if (block.type === "paragraph") {
    return (
      <p key={idx} className="text-[16px] md:text-[24px] leading-[1.25] font-light text-[#1A1A1A]">
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul key={idx} className="text-[16px] md:text-[24px] leading-[1.25] font-light text-[#1A1A1A]">
        {block.items.map(renderListItem)}
      </ul>
    );
  }

  return null;
}

export function DocumentPage({ title, intro, sections }) {
  const containerClass = "w-full max-w-[1868px] px-[24px] mx-auto";

  return (
    <section>
      <div className={containerClass}>
        <h1 className="h2 mb-[32px] lg:mb-[48px] text-center md:text-left">{title}</h1>
        <p className="mb-[24px] md:mb-[32px] text-[16px] md:text-[24px] leading-[1.25] font-light text-[#1A1A1A]">
          {intro}
        </p>
        <ul className="space-y-[24px] md:space-y-[32px]">
          {sections.map((section, index) => (
            <li key={section.id || index} className="">
              <h2 className="mb-[8px] md:mb-[16px] text-[16px] md:text-[24px] h2-roboto font-bold text-[#1A1A1A]">
                {section.title}
              </h2>
              {section.blocks?.map(renderBlock)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
