import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Block} from "./block.model"
import {Transaction} from "./transaction.model"

@Entity_()
export class SetExtendedDurationFunction {
    constructor(props?: Partial<SetExtendedDurationFunction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    @Index_()
    @ManyToOne_(() => Transaction, {nullable: true})
    transaction!: Transaction

    @Index_()
    @Column_("text", {nullable: false})
    name!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    extendedDuration!: bigint | undefined | null
}