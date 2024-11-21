import { useRouter } from 'next/router';
import React from 'react';

const Escrow: React.FC = () => {
    const router = useRouter();
    const { policy } = router.query;

    // TO-DO escrow projects endpoint

    return (
        <div>
            <h1>Escrow Page for {policy}</h1>
            <p>This is the escrow page for the contribution policy.</p>
        </div>
    );
};

export default Escrow;