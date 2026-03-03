/* eslint-disable @typescript-eslint/no-explicit-any */

const GenricCoverFlow = ({ data, idx = 0 }: { data: any, idx?: number }) => {
    const getTitle = () => {
        if ('title' in data) return data.title;
        if ('name' in data) return data.name;
        if ('clientName' in data) return data.clientName;
        return 'Untitled';
    };

    const getDescription = () => {
        if ('description' in data) return data.description;
        if ('content' in data) return data.content;
        if ('bio' in data) return data.bio;
        return '';
    };

    const getRichDescription = () => {
        if ('richDescription' in data) return data.richDescription;
        return '';
    };

    const getCategory = () => {
        if ('category' in data) return data.category;
        if ('industry' in data) return data.industry;
        if ('status' in data) return data.status;
        return null;
    };

    const getTechnologies = () => {
        if ('technologies' in data && data.technologies?.length > 0) {
            return data.technologies.slice(0, 3);
        }
        return null;
    };

    const getClientInfo = () => {
        if ('clientName' in data) {
            return {
                name: data.clientName,
                company: 'clientCompany' in data ? data.clientCompany : null,
            };
        }
        if ('position' in data) {
            return {
                position: data.position,
            };
        }
        return null;
    };

    const getRating = () => {
        if ('rating' in data) return data.rating;
        return null;
    };

    const getPrice = () => {
        if ('price' in data) return data.price;
        return null;
    };

    const title = getTitle();
    const description = getDescription();
    const richDescription = getRichDescription();
    const category = getCategory();
    const technologies = getTechnologies();
    const clientInfo = getClientInfo();
    const rating = getRating();
    const price = getPrice();

    return (
        <div className="group relative h-full w-full flex flex-col items-start justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 shadow-md overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-all duration-500" />
            
            <div className="space-y-4 w-full">
                <div className="flex items-center justify-between w-full">
                    {category && (
                        <span className="inline-block px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-lg uppercase tracking-wide">
                            {category.replace('_', ' ')}
                        </span>
                    )}
                    <span className="text-xs font-bold text-muted-foreground/50">
                        #{String(idx + 1).padStart(2, '0')}
                    </span>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground font-sora line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {clientInfo && (
                    <div className="space-y-1">
                        {clientInfo.name && (
                            <p className="text-sm font-medium text-foreground/90 line-clamp-1">
                                {clientInfo.name}
                            </p>
                        )}
                        {clientInfo.company && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                                {clientInfo.company}
                            </p>
                        )}
                        {clientInfo.position && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                                {clientInfo.position}
                            </p>
                        )}
                    </div>
                )}

                {(rating || price) && (
                    <div className="flex items-center gap-4">
                        {rating && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-muted-foreground">Rating:</span>
                                <span className="text-sm font-bold text-primary">{rating}</span>
                            </div>
                        )}
                        {price && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-muted-foreground">Price:</span>
                                <span className="text-sm font-bold text-primary">{price}</span>
                            </div>
                        )}
                    </div>
                )}
                
                {description && !richDescription && (
                    <p className="text-sm text-muted-foreground leading-relaxed font-inter line-clamp-4">
                        {description}
                    </p>
                )}

                {richDescription && (
                    <div
                        className="text-sm text-muted-foreground leading-relaxed font-inter line-clamp-4 prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: richDescription }}
                    />
                )}

                {technologies && (
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech: any, techIdx: number) => (
                            <span
                                key={techIdx}
                                className="px-2.5 py-1 text-xs border border-border/50 rounded-md bg-muted/50 text-foreground/80"
                            >
                                {tech.technology?.name || tech.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end w-full mt-4 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <span className="text-primary group-hover:text-primary-foreground text-base font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
            </div>
        </div>
    )
}

export default GenricCoverFlow