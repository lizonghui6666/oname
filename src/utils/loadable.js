import Loadable from 'react-loadable'

export default function (loader) {
  return Loadable({
    loader,
    loading: () => '...'
  })
}