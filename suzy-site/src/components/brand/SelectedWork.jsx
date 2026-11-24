import { urlForImage } from '../../utils/image'

/**
 * Selected Work (heading editable in Studio) with work cards (brand book, Components › Work card):
 * 4:3 image, square corners, title (work-title), then "Category · Year" in meta.
 * Renders nothing until Sanity has projects.
 */
function SelectedWork({ projects, heading }) {
  if (!projects?.length) return null
  return (
    <section id="work" aria-labelledby="work-heading" className="border-t border-border py-space-11">
      <div className="container-page">
        <h2 id="work-heading" className="mb-space-8 text-type-heading-section text-ink">
          {heading || 'Selected Work'}
        </h2>
        <ul className="grid gap-space-7 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p._id}>
              <WorkCard project={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function WorkCard({ project }) {
  const meta = [project.category, project.year].filter(Boolean).join(' · ')
  const body = (
    <>
      <div className="aspect-[4/3] overflow-hidden bg-lavender">
        {project.image && (
          <img
            src={urlForImage(project.image, { width: 800 })}
            alt={project.image.alt || ''}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <h3 className="mt-space-3 text-type-work-title text-ink transition-colors group-hover:text-accent">
        {project.title}
      </h3>
      {meta && <p className="text-type-meta text-muted">{meta}</p>}
    </>
  )

  return project.url ? (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="group block">
      {body}
    </a>
  ) : (
    <div>{body}</div>
  )
}

export default SelectedWork
