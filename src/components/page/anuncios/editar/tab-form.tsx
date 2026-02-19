import { getAdminFormAnucioType } from "@/app/gestao/anuncios/action";
import MetaPostForm from "./meta-post-form";

type propsType = {
  postId: string;
  form: getAdminFormAnucioType;
};

export default function TabForm({ postId, form }: propsType) {
  console.log(form)
  return (
    <>
    <div className="w-full bg-[#1E1E1E] border border-[#333] rounded-xl p-6">
      <MetaPostForm edit={form.meta} postId={postId} />
    </div>
    </>
  );
}
