import React from 'react';
import { useRouter } from 'next/router';

export default function Restaurant(): JSX.Element {
    const { query } = useRouter();

    return <div>viewing restaurant {query.id}</div>;
}
