import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  centered = false,
  className = ""
}) => {
  const containerClass = [
    "space-y-2",
    centered ? "text-center" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const descriptionClass = [
    "text-sm text-brand-700 leading-relaxed",
    centered ? "mx-auto max-w-3xl" : "max-w-2xl"
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass}>
      <h1 className="page-title">{title}</h1>
      {description ? <p className={descriptionClass}>{description}</p> : null}
    </div>
  );
};

export default PageHeader;
