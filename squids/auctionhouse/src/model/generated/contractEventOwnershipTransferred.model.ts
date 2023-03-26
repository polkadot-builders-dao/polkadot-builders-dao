import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Index_(["previousOwner", "newOwner"], {unique: false})
@Entity_()
export class ContractEventOwnershipTransferred {
    constructor(props?: Partial<ContractEventOwnershipTransferred>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    blockTimestamp!: Date

    @Index_()
    @Column_("text", {nullable: false})
    transactionHash!: string

    @Index_()
    @Column_("text", {nullable: false})
    contract!: string

    @Index_()
    @Column_("text", {nullable: false})
    eventName!: string

    @Column_("text", {nullable: false})
    previousOwner!: string

    @Index_()
    @Column_("text", {nullable: false})
    newOwner!: string
}
