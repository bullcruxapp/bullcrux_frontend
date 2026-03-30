import { TextInputComponent } from "@/components/TextInput/TextInputComponent"

const RegisterComponent = () => {
    return (
        <div>
            <form>
                <TextInputComponent
                    label="email"
                    placeholder="Enter your email"
                    className=""
                    onChange={(value) => console.log(value)}

                />
            </form>
        </div>
    )
}

export default RegisterComponent