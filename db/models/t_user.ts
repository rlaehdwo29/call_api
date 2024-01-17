import { DataTypes, Model, Sequelize } from 'sequelize';


export interface User {
    cust_id: string;
    dept_id: string;
    user_id: string;
    passwd: string;
    user_name: string;
    tellnum: string;
    email: string;
    talk_yn: string;
    mobile: string;
    grade: string;
    last_login_date: Date;
    use_yn: string;
    regdate: Date;
    memo: string;
    regid: string;
    editdate: Date;
    editid: string;
    auth_seq: BigInteger;
    master_yn: string;
    link24_id: string;
    douzone_id: string;
    user_main_page: string;
    sign_up_hold_yn: string;
    user_ip: string;
    fax: string;
  }
  
  type UserCreateInterface = Pick<User, 'user_id'>;
  

  export class UserModel extends Model<User, UserCreateInterface> implements UserModel {
    public cust_id!: string;
    public dept_id!: string;
    public user_id!: string;
    public passwd!: string;
    public user_name!: string;
    public tellnum!: string;
    public email!: string;
    public talk_yn!: string;
    public mobile!: string;
    public grade!: string;
    public last_login_date!: Date;
    public use_yn!: string;
    public regdate!: Date;
    public memo!: string;
    public regid!: string;
    public editdate!: Date;
    public editid!: string;
    public auth_seq!: BigInteger;
    public master_yn!: string;
    public link24_id!: string;
    public douzone_id!: string;
    public user_main_page!: string;
    public sign_up_hold_yn!: string;
    public user_ip!: string;
    public fax!: string;
  }
  
  export default function (sequelize: Sequelize): typeof UserModel {
    UserModel.init(
      {
        cust_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
          comment: '거래처ID',
        },
        dept_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
          comment: '부서ID',
        },
        user_id: {
          type: DataTypes.STRING(20),
          allowNull: false,
          primaryKey: true,
          comment: '사용자ID',
        },
        passwd: {
          type: DataTypes.STRING(256),
          allowNull: true,
          comment: '비밀번호',
        },
        user_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
          comment: '이름',
        },
        tellnum: {
          type: DataTypes.STRING(13),
          allowNull: true,
          comment: '연락처',
        },
        email: {
          type: DataTypes.STRING(30),
          allowNull: true,
          comment: '이메일',
        },
        talk_yn: {
          type: DataTypes.ENUM('Y', 'N'),
          allowNull: true,
          comment: '알림톡수신여부',
        },
        mobile: {
          type: DataTypes.STRING(13),
          allowNull: true,
          comment: '휴대전화',
        },
        grade: {
          type: DataTypes.STRING(10),
          allowNull: true,
          comment: '직급',
        },
        last_login_date: {
          type: 'TIMESTAMP',
          allowNull: true,
          defaultValue: '0000-00-00 00:00:00',
          comment: '마지막로그인일자',
        },
        use_yn: {
          type: DataTypes.ENUM('Y', 'N'),
          allowNull: true,
          comment: '사용여부',
        },
        regdate: {
            type: 'TIMESTAMP',
          allowNull: true,
          defaultValue: '0000-00-00 00:00:00',
          comment: '등록일',
        },
        memo: {
          type: DataTypes.STRING(1000),
          allowNull: true,
          comment: '메모',
        },
        regid: {
          type: DataTypes.STRING(20),
          allowNull: true,
          comment: '등록ID',
        },
        editdate: {
          type: 'TIMESTAMP',
          allowNull: true,
          defaultValue: '0000-00-00 00:00:00',
          comment: '수정일',
        },
        editid: {
          type: DataTypes.STRING(20),
          allowNull: true,
          comment: '수정ID',
        },
        auth_seq: {
          type: DataTypes.BIGINT,
          allowNull: true,
          comment: '권한SEQ',
        },
        master_yn: {
          type: DataTypes.ENUM('Y', 'N'),
          allowNull: true,
          comment: '마스터계정여부',
        },
        link24_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: '24시콜 아이디',
          },
          douzone_id: {
            type: DataTypes.STRING(10),
            allowNull: true,
            comment: '더존연계ID',
          },
          user_main_page: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: ' 시작페이지 사용자설정',
          },
          sign_up_hold_yn: {
            type: DataTypes.ENUM('Y', 'N'),
            allowNull: true,
            comment: '회원가입 승인대기',
          },
          user_ip: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: '',
          },
          fax: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: '팩스',
          }
      },
      {
        sequelize,
        tableName: 'T_USER',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      },
    );
  
    return UserModel;
  }
  