import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Owner} from "./owner.model"
import {Attribute} from "./attribute.model"
import {Transfer} from "./transfer.model"
import {Bid} from "./bid.model"

@Entity_()
export class Token {
    constructor(props?: Partial<Token>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Column_("text", {nullable: true})
    description!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Owner, {nullable: true})
    owner!: Owner | undefined | null

    @Column_("text", {nullable: true})
    image!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    dna!: bigint | undefined | null

    @OneToMany_(() => Attribute, e => e.token)
    attributes!: Attribute[]

    @OneToMany_(() => Transfer, e => e.token)
    transfers!: Transfer[]

    @OneToMany_(() => Bid, e => e.token)
    bids!: Bid[]
}
