import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Token} from "./token.model"

@Entity_()
export class Attribute {
    constructor(props?: Partial<Attribute>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Token, {nullable: true})
    token!: Token

    @Column_("text", {nullable: false})
    type!: string

    @Column_("text", {nullable: false})
    value!: string
}
