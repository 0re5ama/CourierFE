import { useEffect, useState } from "react";
import testAPI from "../../services/Security";
import useTestStore from "../../stores/TestStore";

function TestCounter() {
    const counter = useTestStore((state) => state.counter);
    return <h1>{counter} around here ...</h1>;
}

function Controls() {
    const increaseCounter = useTestStore((state) => state.increaseCounter);
    return <button onClick={increaseCounter}>one up</button>;
}

function Reset() {
    const resetCounter = useTestStore((state) => state.resetCounter);
    return <button onClick={resetCounter}>Reset</button>;
}

const Test = () => {
    const [name, setName] = useState("");
    useEffect(async () => {
        const nm = await testAPI.sales.getSales();
        setName(nm?.data?.name);
    }, []);
    return (
        <div>
            <div>{name}</div>
            <TestCounter />
            <Controls />
            <Reset />
        </div>
    );
};

export default Test;
