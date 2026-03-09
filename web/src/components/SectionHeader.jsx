function SectionHeader({ eyebrow, title, description, actionLabel }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <p className="section-header__eyebrow">{eyebrow}</p> : null}
        <h2 className="section-header__title">{title}</h2>
        {description ? <p className="section-header__description">{description}</p> : null}
      </div>
      {actionLabel ? (
        <button className="secondary-button" type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default SectionHeader;
