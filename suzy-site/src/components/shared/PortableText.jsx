// Self-contained Portable Text renderer — no external dependencies.
// Named exports only — no default export.
// Safari throws "importing binding name 'default' cannot be resolved
// by star export entries" when a file mixes named exports with a
// default export that points to the same function.

function renderMark(mark, children, markDefs = []) {
  switch (mark) {
    case 'strong':
      return <strong className="font-medium">{children}</strong>
    case 'em':
      return <em className="italic">{children}</em>
    case 'underline':
      return <span className="underline">{children}</span>
    case 'code':
      return <code className="text-sm bg-lavender px-1 py-0.5 rounded">{children}</code>
    default: {
      const def = markDefs.find((d) => d._key === mark)
      if (def?._type === 'link') {
        return (
          <a
            href={def.href}
            target={def.blank ? '_blank' : undefined}
            rel={def.blank ? 'noopener noreferrer' : undefined}
            className="text-accent hover:text-ink underline transition-colors"
          >
            {children}
          </a>
        )
      }
      return <>{children}</>
    }
  }
}

function renderSpan(child, markDefs = []) {
  const content = child.text || ''
  if (!child.marks || child.marks.length === 0) return content
  return child.marks.reduce((acc, mark) => renderMark(mark, acc, markDefs), content)
}

function renderBlock(block, index, paragraphClassName = 'mb-6 text-xl leading-relaxed') {
  const children = (block.children || []).map((child, i) => (
    <span key={i}>{renderSpan(child, block.markDefs)}</span>
  ))

  switch (block.style) {
    case 'h2':
      return <h2 key={index} className="text-3xl font-normal mt-10 mb-4">{children}</h2>
    case 'h3':
      return <h3 key={index} className="text-2xl font-normal mt-8 mb-3">{children}</h3>
    case 'blockquote':
      return (
        <blockquote key={index} className="border-l-2 border-accent pl-6 my-8 text-body italic">
          {children}
        </blockquote>
      )
    default:
      return <p key={index} className={paragraphClassName}>{children}</p>
  }
}

// paragraphClassName lets a page set its brand text style (e.g. lead or body).
export function PortableText({ value, paragraphClassName }) {
  if (!value || !Array.isArray(value)) return null
  return (
    <div className="prose-custom">
      {value.map((block, index) => {
        if (block._type === 'block') return renderBlock(block, index, paragraphClassName)
        return null
      })}
    </div>
  )
}

export function PortableTextWithDropCap({ value }) {
  if (!value || value.length === 0) return null

  const [firstBlock, ...restBlocks] = value

  const firstChildren = firstBlock?._type === 'block'
    ? (firstBlock.children || []).map((child, i) => (
        <span key={i}>{renderSpan(child, firstBlock.markDefs)}</span>
      ))
    : null

  return (
    <div className="prose-custom text-xl leading-relaxed">
      {firstChildren && (
        <p className="first-letter:text-7xl first-letter:font-normal first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-accent mb-6">
          {firstChildren}
        </p>
      )}
      {restBlocks.map((block, index) => {
        if (block._type === 'block') return renderBlock(block, index + 1)
        return null
      })}
    </div>
  )
}
