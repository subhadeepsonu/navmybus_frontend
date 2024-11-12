export default function DriverCard(props: {
    name: string,
}
) {
    return <div className="h-20 w-full rounded-sm border-2 flex justify-center items-center bg-white">
        {props.name}
    </div>
}