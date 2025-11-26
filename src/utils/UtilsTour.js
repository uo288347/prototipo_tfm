
export const getTourSteps =({ bannerRef }) =>  [
        {
            title: 'Follow the Instructions',
            description: 'Pay attention to the banner messages. This banner will tell you what to do. It will update automatically as you complete each step, guiding you through the entire process.',
            target: () => bannerRef.current,
        },
        {
            title: 'Follow the Instructions',
            description: 'Pay attention to the banner messages. Each instruction will guide you to the next action you need to take in the application.',
            target: () => bannerRef.current,
        },
        {
            title: 'Dynamic Updates',
            description: 'The banner content changes dynamically based on your progress. Just follow along and complete each task as indicated.',
            target: () => bannerRef.current,
        },
    ];