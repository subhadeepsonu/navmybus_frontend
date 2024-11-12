export default function BusCard(props: {
    busno: string
}) {
    return <div className="border-2 bg-white flex justify-center items-center h-20 w-full">
        BUS NO: {props.busno}
    </div>
}