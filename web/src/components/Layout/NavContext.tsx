import { provideContext } from "../../lib/provideContext"
import { useOpenClose } from "../../lib/useOpenClose"

const useNavProvider = () => useOpenClose()

export const [NavProvider, useNav] = provideContext(useNavProvider)
