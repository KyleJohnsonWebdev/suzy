import { useParams } from 'react-router-dom'
import { useEntry } from '../hooks/useEntry'
import { ENTRY_TYPES } from '../constants/entryTypes'
import ImageDetail from '../components/detail/ImageDetail'
import VideoDetail from '../components/detail/VideoDetail'
import StatementDetail from '../components/detail/StatementDetail'
import LoadingScreen from '../components/shared/LoadingScreen'
import ErrorScreen from '../components/shared/ErrorScreen'

const DETAIL_LAYOUTS = {
  [ENTRY_TYPES.IMAGE]: ImageDetail,
  [ENTRY_TYPES.VIDEO]: VideoDetail,
  [ENTRY_TYPES.STATEMENT]: StatementDetail,
}

function EntryDetail() {
  const { slug } = useParams()
  const { entry, loading, error } = useEntry(slug)

  if (loading) return <LoadingScreen fullScreen />

  if (error) {
    return (
      <ErrorScreen
        message="We couldn't load this entry."
        backTo="/entries"
        backLabel="← Back to entries"
      />
    )
  }

  if (!entry) {
    return (
      <ErrorScreen
        message="Entry not found."
        backTo="/entries"
        backLabel="← Back to entries"
      />
    )
  }

  const Layout = DETAIL_LAYOUTS[entry.entryType]
  if (!Layout) {
    return (
      <ErrorScreen
        message="Unknown entry type."
        backTo="/entries"
        backLabel="← Back to entries"
      />
    )
  }

  return <Layout entry={entry} />
}

export default EntryDetail
