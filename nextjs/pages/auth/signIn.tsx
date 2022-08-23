import {getProviders, signIn} from "next-auth/react"
import {GetServerSideProps} from "next"

export default function SignIn(props: {providers: any[]}) {
  return (
    <>
      {Object.values(props.providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            with {provider.name}
          </button>
        </div>
      ))}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
