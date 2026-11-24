import { useParams } from 'react-router-dom'
import { useEntry } from '../hooks/useEntry'
import { useSeo, describe } from '../seo/useSeo'
import { ENTRY_TYPES } from '../constants/entryTypes'
import ImageDetail from '../components/detail/ImageDetail'
import VideoDetail from '../components/detail/VideoDetail'
import StatementDetail from '../components/detail/StatementDetail'
import PostDetail from '../components/detail/PostDetail'
import LoadingScreen from '../components/shared/LoadingScreen'
import ErrorScreen from '../components/shared/ErrorScreen'

const DETAIL_LAYOUTS = {
  [ENTRY_TYPES.IMAGE]: ImageDetail,
  [ENTRY_TYPES.VIDEO]: VideoDetail,
  [ENTRY_TYPES.STATEMENT]: StatementDetail,
  [ENTRY_TYPES.POST]: PostDetail,
}

function EntryDetail() {
  const { slug } = useParams()
  const { entry, loading, error } = useEntry(slug)
  useSeo({
    title: entry?.title || 'Blog',
    description: describe(entry?.caption || entry?.body || entry?.postBody),
    image: entry?.image || entry?.postBody?.find((b) => b._type === 'image'),
    type: 'article',
  })

  if (loading) return <LoadingScreen fullScreen />

  if (error) {
    return (
      <ErrorScreen
        message="We couldn't load this entry."
        backTo="/blog"
        backLabel="← Back to blog"
      />
    )
  }

  if (!entry) {
    return (
      <ErrorScreen
        message="Entry not found."
        backTo="/blog"
        backLabel="← Back to blog"
      />
    )
  }

  const Layout = DETAIL_LAYOUTS[entry.entryType]
  if (!Layout) {
    return (
      <ErrorScreen
        message="Unknown entry type."
        backTo="/blog"
        backLabel="← Back to blog"
      />
    )
  }

  return <Layout entry={entry} />
}

export default EntryDetail
