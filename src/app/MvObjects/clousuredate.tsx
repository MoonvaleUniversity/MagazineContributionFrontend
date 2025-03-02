export interface IClosureDate {
    id: number;
    closure_date: string;         // Start date (ISO string format)
    final_closure_date: string;   // Final closure date (ISO string format)
    academic_year_id: number;
    version?: number;
    created_at?: string;
    updated_at?: string;
}

export class ClosureDate {
    id: number;
    closureDate: Date;
    finalClosureDate: Date;
    academicYearId: number;
    version?: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(data: IClosureDate) {
        this.id = data.id;
        this.closureDate = new Date(data.closure_date);
        this.finalClosureDate = new Date(data.final_closure_date);
        this.academicYearId = data.academic_year_id;
        this.version = data.version;
        this.createdAt = data.created_at ? new Date(data.created_at) : undefined;
        this.updatedAt = data.updated_at ? new Date(data.updated_at) : undefined;
    }

    /**
     * Creates a ClosureDate instance from a plain object.
     */
    static fromMap(data: IClosureDate): ClosureDate {
        return new ClosureDate(data);
    }

    /**
     * Converts the ClosureDate instance into a plain object.
     */
    toMap(): IClosureDate {
        return {
            id: this.id,
            closure_date: this.closureDate.toISOString(),
            final_closure_date: this.finalClosureDate.toISOString(),
            academic_year_id: this.academicYearId,
            version: this.version,
            created_at: this.createdAt ? this.createdAt.toISOString() : undefined,
            updated_at: this.updatedAt ? this.updatedAt.toISOString() : undefined,
        };
    }

    /**
     * Checks if the current date is past the final closure date.
     */
    isLocked(): boolean {
        return new Date() > this.finalClosureDate;
    }
}
