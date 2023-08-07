import { trpc } from './providers/trpc';

function App() {
  const meQuery = trpc.users.me.useQuery();
  return (
    <>
      <div>{meQuery.data ?? 'fetching'}</div>
    </>
  );
}

export default App;
