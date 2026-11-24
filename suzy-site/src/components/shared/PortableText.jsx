// Self-contained Portable Text renderer — no external dependencies.
// Named exports only — no default export.
// Safari throws "importing binding name 'default' cannot be resolved
// by star export entries" when a file mixes named exports with a
// default export that points to the same function.

import { urlForImage } from '../../utils/image'
import { getVideoEmbedUrl } from '../../utils/youtube'

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

// ─── Posts: long-form text with lists, photos and embeds ──────────────────────

// Consecutive list items share one <ul>/<ol>; Portable Text stores them flat.
function groupLists(blocks) {
  const out = []
  for (const block of blocks) {
    const last = out[out.length - 1]
    if (block._type === 'block' && block.listItem) {
      if (last?._type === 'list' && last.listItem === block.listItem) last.items.push(block)
      else out.push({ _type: 'list', _key: `list-${block._key}`, listItem: block.listItem, items: [block] })
    } else {
      out.push(block)
    }
  }
  return out
}

function PostImage({ value }) {
  const src = urlForImage(value, { width: 1400 })
  if (!src) return null
  return (
    <figure className="my-space-9">
      <img
        src={src}
        srcSet={[700, 1050, 1400].map((w) => `${urlForImage(value, { width: w })} ${w}w`).join(', ')}
        sizes="(min-width: 768px) 672px, 100vw"
        alt={value.alt || ''}
        loading="lazy"
        className="w-full"
      />
      {value.caption && <figcaption className="mt-space-3 text-type-meta text-muted">{value.caption}</figcaption>}
    </figure>
  )
}

function PostEmbed({ value }) {
  if (!value?.url) return null
  const player = getVideoEmbedUrl(value.url)
  return (
    <figure className="my-space-9">
      {player ? (
        <div className="aspect-video w-full overflow-hidden bg-lavender">
          <iframe
            src={player}
            title={value.title || 'Embedded video'}
            className="h-full w-full"
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-border bg-lavender p-space-6 transition-colors hover:text-accent"
        >
          <span className="block text-type-ui text-ink">{value.title || value.url}</span>
          <span className="mt-space-1 block break-all text-type-meta text-muted">{hostOf(value.url)} ↗</span>
        </a>
      )}
      {value.caption && <figcaption className="mt-space-3 text-type-meta text-muted">{value.caption}</figcaption>}
    </figure>
  )
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const POST_PARAGRAPH = 'mb-space-6 text-type-body text-body'

export function PostBody({ value }) {
  if (!Array.isArray(value) || value.length === 0) return null
  return (
    <div className="prose-custom">
      {groupLists(value).map((node, index) => {
        const key = node._key || index
        switch (node._type) {
          case 'block':
            return renderBlock({ ...node, _key: key }, key, POST_PARAGRAPH)
          case 'list': {
            const List = node.listItem === 'number' ? 'ol' : 'ul'
            return (
              <List key={key} className={`mb-space-6 space-y-space-2 pl-space-6 text-type-body text-body ${List === 'ol' ? 'list-decimal' : 'list-disc'}`}>
                {node.items.map((item, i) => (
                  <li key={item._key || i}>
                    {(item.children || []).map((child, j) => (
                      <span key={j}>{renderSpan(child, item.markDefs)}</span>
                    ))}
                  </li>
                ))}
              </List>
            )
          }
          case 'image':
            return <PostImage key={key} value={node} />
          case 'embed':
            return <PostEmbed key={key} value={node} />
          default:
            return null
        }
      })}
    </div>
  )
}
