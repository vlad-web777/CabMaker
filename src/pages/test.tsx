export default function TestPage() {
    const nLinks = [
        { label: "frameless", type1: "Euro Base", type2: "Euro Wall", type3: "Euro Tall" },
        { label: "framed", type1: "Frame Base", type2: "Frame Wall", type3: "Frame Tall" },
    ]
    return (

        <div className="bg-gray-500">
            {nLinks.map((link) => (
                <div>
                    <h1>{link.label}</h1>
                    <ol>
                        {link.type1}
                        {link.type2}
                        {link.type3}
                    </ol>

                </div>
            ))}
        </div>
    )
}

