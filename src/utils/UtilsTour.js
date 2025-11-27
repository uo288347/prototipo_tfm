
export const getTourSteps =({ bannerRef }) =>  [
        {
            title: 'Follow the Instructions',
            description: 'Pay attention to the banner messages. This banner will tell you what to do',
            target: () => bannerRef.current,
            style: { margin: '0 0px'}
        },
        {
            title: 'Dynamic Updates',
            description: 'The banner content changes dynamically based on your progress. Follow along and complete each task as indicated.',
            target: () => bannerRef.current,
            style: { margin: '0 0px'}

        },
    ];